package com.dmk.service;

import com.dmk.domain.User;
import com.dmk.service.job.MailTaskFilterStatusJob;
import io.github.jhipster.config.JHipsterProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import java.net.URISyntaxException;
import java.util.Locale;

/**
 * Service for sending emails.
 * <p>
 * We use the @Async annotation to send emails asynchronously.
 */
@Service
public class MailService {

    private final Logger log = LoggerFactory.getLogger(MailService.class);

    private static final String USER = "user";

    private static final String BASE_URL = "baseUrl";

    private final JHipsterProperties jHipsterProperties;

    private final MessageSource messageSource;

    private final SpringTemplateEngine templateEngine;

    @Autowired
    private MailTaskFilterStatusJob mailTaskFilterStatusJob;

    public MailService(JHipsterProperties jHipsterProperties,
            MessageSource messageSource, SpringTemplateEngine templateEngine) {

        this.jHipsterProperties = jHipsterProperties;
        this.messageSource = messageSource;
        this.templateEngine = templateEngine;
    }

    @Async
    public void sendEmailFromTemplate(User user, String templateName, String titleKey) {
        try {
            Locale locale = Locale.forLanguageTag(user.getLangKey());
            Context context = new Context(locale);
            context.setVariable(USER, user);
            context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());
            String content = templateEngine.process(templateName, context);
            String subject = messageSource.getMessage(titleKey, null, locale);
            mailTaskFilterStatusJob.sendEmail(user.getEmail(), subject, content, false, true);
        } catch (URISyntaxException e) {
            if (log.isDebugEnabled()) {
                log.warn("URI isn't correct ", e.getReason(), e.getMessage());
            }
        }
    }

    @Async
    public void sendActivationEmail(User user) {
        log.debug("Sending activation email to '{}'", user.getEmail());
        sendEmailFromTemplate(user, "mail/activationEmail", "email.activation.title");
    }

    @Async
    public void sendCreationEmail(User user) {
        log.debug("Sending creation email to '{}'", user.getEmail());
        sendEmailFromTemplate(user, "mail/creationEmail", "email.activation.title");
    }

    @Async
    public void sendPasswordResetMail(User user) {
        log.debug("Sending password reset email to '{}'", user.getEmail());
        sendEmailFromTemplate(user, "mail/passwordResetEmail", "email.reset.title");
    }

    @Async
    public void sendTestMail(User user) {
        log.debug("Sending test email to '{}'", user.getEmail());
        sendEmailFromTemplate(user, "mail/testEmail", "email.test.title");
    }
}
