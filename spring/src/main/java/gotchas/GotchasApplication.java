package gotchas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Component scanning starts here and picks up every @Component/@Service/@RestController below `gotchas`.
@SpringBootApplication
public class GotchasApplication {
	public static void main(String[] args) {
		SpringApplication.run(GotchasApplication.class, args);
	}
}
