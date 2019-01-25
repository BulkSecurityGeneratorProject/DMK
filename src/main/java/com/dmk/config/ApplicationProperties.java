package com.dmk.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to DMK.
 * <p>
 * Properties are configured in the application.yml file.
 * See {@link io.github.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {

    private String removeErrorMailTaskTimeMl;

    public String getRemoveErrorMailTaskTimeMl() {
        return removeErrorMailTaskTimeMl;
    }

    public void setRemoveErrorMailTaskTimeMl(String removeErrorMailTaskTimeMl) {
        this.removeErrorMailTaskTimeMl = removeErrorMailTaskTimeMl;
    }
}
