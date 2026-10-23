package dev.ach.dienstplanung.auth;

import dev.ach.dienstplanung.security.JwtService;
import dev.ach.dienstplanung.security.Role;
import dev.ach.dienstplanung.security.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dienstplan/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );
        String username = auth.getName();
        Role role = userRepository.findByUsername(username)
                .orElseThrow()
                .getRole();

        String token = jwtService.generateTokens(username, role);
        return  ResponseEntity.ok(new LoginResponse(token, role.name(), username));

    }
}
