package com.neighborhoodwatch.presentation.dto.User;

import lombok.Getter;
import lombok.Setter;


public class SetNeighborhoodDto {
    private String code;

    public SetNeighborhoodDto() {}

    public SetNeighborhoodDto(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }

}
