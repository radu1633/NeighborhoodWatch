package com.neighborhoodwatch.application.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
//import com.neighborhoodwatch.application.mapper.NeighborhoodMapper;
import com.neighborhoodwatch.domain.model.Neighborhood;
import com.neighborhoodwatch.domain.model.User;
import com.neighborhoodwatch.infrastructure.repository.ContactRepository;
import com.neighborhoodwatch.infrastructure.repository.NeighborhoodRepository;
import com.neighborhoodwatch.infrastructure.repository.UserRepository;
import com.neighborhoodwatch.presentation.dto.Neighborhood.NeighborhoodPolygon;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class NeighborhoodService {

    private final NeighborhoodRepository repository;
    private final CityService cityService;
    private final UserRepository userRepository;
    private final ContactRepository contactRepository;
    private final List<NeighborhoodPolygon> neighborhoods = new ArrayList<>();

    public NeighborhoodService(NeighborhoodRepository repository, CityService cityService, UserRepository userRepository, ContactRepository contactRepository) {
        this.repository = repository;
        this.cityService = cityService;
        this.userRepository = userRepository;
        this.contactRepository = contactRepository;
    }

    public List<Neighborhood> getAllNeighborhoods() {
        return repository.findAll();
    }

    public Neighborhood getNeighborhood(Long id) {
        return repository.findById(id).orElse(null);
    }

//    public Neighborhood createNeighborhood(CreateNeighborhoodDto neighborhood) {
//        Neighborhood newNeighborhood = NeighborhoodMapper.toNeighborhood(neighborhood, cityService.getCityById(neighborhood.getCityId()), CodeGenerator.generateNeighborhoodCode(6));
//        return repository.save(newNeighborhood);
//    }

    @PostConstruct
    public void loadNeighborhoodsFromDb() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        GeometryFactory factory = new GeometryFactory();

        for (Neighborhood dbNeighborhood : repository.findAll()) {
            Long id = dbNeighborhood.getId();
            String name = dbNeighborhood.getName();
            String coordinatesJson = dbNeighborhood.getCoordinates();

            List<List<Double>> coords = mapper.readValue(coordinatesJson, new TypeReference<>() {});
            Coordinate[] jtsCoords = coords.stream()
                    .map(pair -> new Coordinate(pair.get(0), pair.get(1)))
                    .toArray(Coordinate[]::new);

            Polygon polygon = factory.createPolygon(jtsCoords);
            neighborhoods.add(new NeighborhoodPolygon(id, name, polygon));
        }
    }

    public NeighborhoodPolygon findNeighborhood(double lat, double lon) {
        Point point = new GeometryFactory().createPoint(new Coordinate(lon, lat));

        for (NeighborhoodPolygon np : neighborhoods) {
            if (np.getPolygon().covers(point)) {
                return np;
            }
        }

        return null;
    }

//    public Neighborhood getNeighborhoodByCode(String code) {
//        Neighborhood neighborhood = repository.getNeighborhoodByCode(code);
//        if (neighborhood == null) {
//            return null;
//        }
//        return neighborhood;
//    }

    @Transactional
    public void deleteNeighborhood(Long neighborhoodId) {
        // Scoate toți userii din cartier
        List<User> users = userRepository.findAllByNeighborhoodId(neighborhoodId);
        for (User user : users) {
            user.setNeighborhood(null);
        }

        userRepository.saveAll(users); // sau folosește merge automat

        // Șterge contactele între acești utilizatori
        for (User user : users) {
            contactRepository.deleteByUserIdOrContactUserId(user.getId(), user.getId());
        }

        // Șterge cartierul
        repository.deleteById(neighborhoodId);
    }


//    public Neighborhood findByCode(String code) {
//        return repository.getNeighborhoodByCode(code);
//    }


    public Neighborhood extractNeighborhoodFromID(MultipartFile file) throws IOException {
        BufferedImage bufferedImage = ImageIO.read(file.getInputStream());
        if (bufferedImage == null) {
            return null;
        }

        File tempImageFile = File.createTempFile("ocr_img", ".png");
        ImageIO.write(bufferedImage, "png", tempImageFile);

        Tesseract tesseract = new Tesseract();
        tesseract.setDatapath("src/main/resources/tessdata");
        tesseract.setLanguage("ron");

        String ocrText;
        try {
            ocrText = tesseract.doOCR(tempImageFile);
        } catch (TesseractException e) {
            return null;
        } finally {
            tempImageFile.delete();
        }

        String[] lines = ocrText.split("\n");
        Optional<String> addressLine = Arrays.stream(lines)
                .map(String::trim)
                .filter(line ->
                        (line.toLowerCase().contains("str") || line.toLowerCase().contains("b-dul") ||
                                line.toLowerCase().contains("bd") || line.toLowerCase().contains("calea")) &&
                                (line.toLowerCase().contains("constanța") || line.toLowerCase().contains("constanta"))
                )
                .findFirst();

        if (addressLine.isEmpty()) {
            return null;
        }

        String line = addressLine.get();
        Pattern pattern = Pattern.compile("(str\\.|b-dul|bd\\.|calea)\\s+([\\p{L}0-9\\s]+)[,\\s]*nr\\.?\\s*(\\d+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(line);

        String strada = "necunoscută";
        String numar = "necunoscut";
        if (matcher.find()) {
            strada = matcher.group(2).trim();
            numar = matcher.group(3).trim();
        }

        String fullAddress = strada + "+" + numar + "+Constanta+Romania";
        Optional<double[]> coord = geocodeAddress(fullAddress);

        if (coord.isPresent()) {
            double lat = coord.get()[0];
            double lon = coord.get()[1];

            NeighborhoodPolygon neighborhoodPolygon = findNeighborhood(lat, lon);
            Neighborhood neighborhood = repository.findById(neighborhoodPolygon.getId()).get();



            return neighborhood;
        }

        return null;
    }

    private Optional<double[]> geocodeAddress(String address) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl("https://nominatim.openstreetmap.org/search")
                    .queryParam("q", address)
                    .queryParam("format", "json")
                    .queryParam("limit", "1")
                    .toUriString();

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "neighborhood-watch/1.0 (test@example.com)");
            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            if (root.isArray() && root.size() > 0) {
                JsonNode result = root.get(0);
                double lat = result.get("lat").asDouble();
                double lon = result.get("lon").asDouble();
                return Optional.of(new double[]{lat, lon});
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return Optional.empty();
    }



}
