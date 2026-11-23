package gotchas.validation;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// Unlike TypeScript, `Integer` is a real runtime type: Jackson refuses to put "abc" in it.
// The constraint annotations, though, only run when @Valid is present.
public record CreateOrderRequest(@NotBlank String productId, @NotNull @Min(1) Integer quantity) {}
