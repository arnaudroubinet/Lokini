package dev.lokini.server;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.lang.ArchRule;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

/**
 * Architecture tests for the Lokini server.
 * Validates that the hexagonal architecture (ports & adapters) rules are respected.
 *
 * All rules use allowEmptyShould(true) so they pass when packages have no classes yet
 * (project bootstrap phase). They will enforce constraints as soon as classes are added.
 */
class ArchitectureTest {

    private static final String BASE_PACKAGE = "dev.lokini.server";
    private static final String DOMAIN_PACKAGE = BASE_PACKAGE + ".domain..";
    private static final String DOMAIN_MODEL_PACKAGE = BASE_PACKAGE + ".domain.model..";
    private static final String DOMAIN_PORT_IN_PACKAGE = BASE_PACKAGE + ".domain.port.in..";
    private static final String DOMAIN_PORT_OUT_PACKAGE = BASE_PACKAGE + ".domain.port.out..";
    private static final String DOMAIN_USECASE_PACKAGE = BASE_PACKAGE + ".domain.usecase..";
    private static final String ADAPTER_PACKAGE = BASE_PACKAGE + ".adapter..";
    private static final String ADAPTER_IN_PACKAGE = BASE_PACKAGE + ".adapter.in..";
    private static final String ADAPTER_OUT_PACKAGE = BASE_PACKAGE + ".adapter.out..";

    private static JavaClasses classes;

    @BeforeAll
    static void importClasses() {
        classes = new ClassFileImporter()
                .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
                .importPackages(BASE_PACKAGE);
    }

    @Nested
    @DisplayName("Domain layer rules")
    class DomainLayerRules {

        @Test
        @DisplayName("Domain must not depend on adapters")
        void domainMustNotDependOnAdapters() {
            ArchRule rule = noClasses()
                    .that().resideInAPackage(DOMAIN_PACKAGE)
                    .should().dependOnClassesThat().resideInAPackage(ADAPTER_PACKAGE)
                    .allowEmptyShould(true);

            rule.check(classes);
        }

        @Test
        @DisplayName("Domain must not depend on Quarkus framework")
        void domainMustNotDependOnQuarkus() {
            ArchRule rule = noClasses()
                    .that().resideInAPackage(DOMAIN_PACKAGE)
                    .should().dependOnClassesThat().resideInAPackage("io.quarkus..")
                    .allowEmptyShould(true);

            rule.check(classes);
        }

        @Test
        @DisplayName("Domain must not depend on Jakarta REST")
        void domainMustNotDependOnJakartaRest() {
            ArchRule rule = noClasses()
                    .that().resideInAPackage(DOMAIN_PACKAGE)
                    .should().dependOnClassesThat().resideInAPackage("jakarta.ws.rs..")
                    .allowEmptyShould(true);

            rule.check(classes);
        }

        @Test
        @DisplayName("Domain must not depend on Hibernate/JPA")
        void domainMustNotDependOnHibernate() {
            ArchRule rule = noClasses()
                    .that().resideInAPackage(DOMAIN_PACKAGE)
                    .should().dependOnClassesThat().resideInAnyPackage(
                            "jakarta.persistence..",
                            "org.hibernate..",
                            "io.quarkus.hibernate.."
                    )
                    .allowEmptyShould(true);

            rule.check(classes);
        }

        @Test
        @DisplayName("Domain models must not depend on domain use cases or ports")
        void modelsMustBeIndependent() {
            ArchRule rule = noClasses()
                    .that().resideInAPackage(DOMAIN_MODEL_PACKAGE)
                    .should().dependOnClassesThat().resideInAnyPackage(
                            DOMAIN_USECASE_PACKAGE,
                            DOMAIN_PORT_IN_PACKAGE,
                            DOMAIN_PORT_OUT_PACKAGE
                    )
                    .allowEmptyShould(true);

            rule.check(classes);
        }
    }

    @Nested
    @DisplayName("Adapter layer rules")
    class AdapterLayerRules {

        @Test
        @DisplayName("Inbound adapters must not depend on outbound adapters")
        void inboundMustNotDependOnOutbound() {
            ArchRule rule = noClasses()
                    .that().resideInAPackage(ADAPTER_IN_PACKAGE)
                    .should().dependOnClassesThat().resideInAPackage(ADAPTER_OUT_PACKAGE)
                    .allowEmptyShould(true);

            rule.check(classes);
        }

        @Test
        @DisplayName("Outbound adapters must not depend on inbound adapters")
        void outboundMustNotDependOnInbound() {
            ArchRule rule = noClasses()
                    .that().resideInAPackage(ADAPTER_OUT_PACKAGE)
                    .should().dependOnClassesThat().resideInAPackage(ADAPTER_IN_PACKAGE)
                    .allowEmptyShould(true);

            rule.check(classes);
        }

        @Test
        @DisplayName("Adapters must not depend on domain use cases directly")
        void adaptersMustNotDependOnUsecases() {
            ArchRule rule = noClasses()
                    .that().resideInAPackage(ADAPTER_PACKAGE)
                    .should().dependOnClassesThat().resideInAPackage(DOMAIN_USECASE_PACKAGE)
                    .allowEmptyShould(true);

            rule.check(classes);
        }
    }

    @Nested
    @DisplayName("Port rules")
    class PortRules {

        @Test
        @DisplayName("Driving ports (port.in) must only be interfaces")
        void drivingPortsMustBeInterfaces() {
            ArchRule rule = classes()
                    .that().resideInAPackage(DOMAIN_PORT_IN_PACKAGE)
                    .should().beInterfaces()
                    .allowEmptyShould(true);

            rule.check(classes);
        }

        @Test
        @DisplayName("Driven ports (port.out) must only be interfaces")
        void drivenPortsMustBeInterfaces() {
            ArchRule rule = classes()
                    .that().resideInAPackage(DOMAIN_PORT_OUT_PACKAGE)
                    .should().beInterfaces()
                    .allowEmptyShould(true);

            rule.check(classes);
        }
    }
}
