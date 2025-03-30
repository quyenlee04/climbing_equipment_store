package com.climbing.store.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

@Configuration
public class StaticResourceConfig {

    @Value("${upload.path:c:/Users/PC/Desktop/climbing-equipment-store/uploads}")
    private String uploadPath;

    private MediaType getMediaTypeForFileName(String fileName) {
        if (fileName.endsWith(".png")) {
            return MediaType.IMAGE_PNG;
        } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
            return MediaType.IMAGE_JPEG;
        } else if (fileName.endsWith(".gif")) {
            return MediaType.IMAGE_GIF;
        }
        return MediaType.APPLICATION_OCTET_STREAM;
    }

    @Bean
    public RouterFunction<ServerResponse> imageRouter() {
        return RouterFunctions
            .route()
            .GET("/uploads/**", request -> {
                String filename = request.path().substring("/uploads/".length());
                Path filePath = Paths.get(uploadPath, filename);
                Resource resource = new FileSystemResource(filePath.toString());
                
                if (!resource.exists()) {
                    return ServerResponse.notFound().build();
                }
                
                return ServerResponse
                    .ok()
                    .contentType(getMediaTypeForFileName(filename))
                    .body(BodyInserters.fromResource(resource));
            })
            .build();
    }
}