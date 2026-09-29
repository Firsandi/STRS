package id.rs.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Hospital API Gateway Service
 * Mata Kuliah: Sistem Terdistribusi - Fasilkom UNEJ
 * Sesuai contoh implementasi Spring Cloud Gateway pada materi perkuliahan.
 */
@SpringBootApplication
public class HospitalGatewayApplication {

    public static void main(String[] args) {
        System.out.println("==========================================================");
        System.out.println(" [GATEWAY] Memulai Hospital Spring Cloud Gateway Port 8000");
        System.out.println("==========================================================");
        SpringApplication.run(HospitalGatewayApplication.class, args);
    }

}
