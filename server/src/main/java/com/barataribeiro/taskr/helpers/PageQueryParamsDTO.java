package com.barataribeiro.taskr.helpers;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class PageQueryParamsDTO {
    @Schema(description = "Page number (zero-based)", example = "0")
    @PositiveOrZero(message = "Page must be zero or a positive value")
    private int page = 0;

    @Schema(description = "Number of items per page", example = "10")
    @Length(max = 25, message = "PerPage must be a positive value up to 25")
    private int perPage = 10;

    @Schema(description = "Sort direction (ASC or DESC)", example = "ASC")
    @Pattern(regexp = "^(ASC|DESC)$", message = "Direction must be either 'ASC' or 'DESC'")
    private String direction = "ASC";

    @Schema(description = "Field to order by", example = "createdAt")
    private String orderBy = "createdAt";
}
