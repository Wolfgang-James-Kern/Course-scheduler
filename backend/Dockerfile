FROM maven:3.9.12-eclipse-temurin-17 AS build

WORKDIR /workspace
COPY pom.xml ./
RUN mvn -q -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre-jammy

RUN groupadd --system app && useradd --system --gid app app
WORKDIR /app
COPY --from=build /workspace/target/course-scheduler-0.0.1-SNAPSHOT.jar app.jar
RUN chown -R app:app /app
USER app

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
