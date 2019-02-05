package com.dmk.service.job;

import com.dmk.config.ApplicationProperties;
import com.dmk.domain.Defaults;
import com.dmk.domain.Mail;
import com.dmk.domain.MailTask;
import com.dmk.repository.MailTaskRepository;
import com.dmk.web.rest.MailResource;
import com.dmk.web.rest.MailTaskResource;
import io.github.jhipster.config.JHipsterProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;

@Service
public class MailTaskFilterStatusJob {

    private final Logger log = LoggerFactory.getLogger(MailTaskFilterStatusJob.class);

    private final JHipsterProperties jHipsterProperties;

    private final JavaMailSender javaMailSender;

    @Autowired
    private MailTaskRepository mailTaskRepository;

    @Autowired
    private MailTaskResource mailTaskResource;

    @Autowired
    private MailResource mailResource;

    @Autowired
    private ApplicationProperties applicationProperties;

    public MailTaskFilterStatusJob(JHipsterProperties jHipsterProperties, JavaMailSender javaMailSender) {
        this.jHipsterProperties = jHipsterProperties;
        this.javaMailSender = javaMailSender;
    }

    @Scheduled(fixedRate = 15000)
    public void checkReadyToSendMails() throws URISyntaxException {
        List<MailTask> mailTaskList = mailTaskRepository.findByStatus(Defaults.MailStatus.READY_TO_SEND);

        if (!mailTaskList.isEmpty()) {
            for (MailTask mailTask : mailTaskList) {
                Mail mail = mailResource.getMail(mailTask.getMailId()).getBody();
                if (mail != null) {
                    if (sendEmail(mail.getTo(), mail.getSubject(), mail.getContent(),
                        false, true)) {
                        mailTask.setStatus(Defaults.MailStatus.SENT);
                    } else {
                        mailTask.setStatus(Defaults.MailStatus.ERROR);
                    }
                    mailTaskResource.updateMailTask(mailTask);
                } else {
                    if (log.isDebugEnabled()) {
                        log.warn("Mail with id = {} doesn't exist", mailTask.getMailId());
                    }
                }
            }
        }
    }

    @Scheduled(fixedRate = 15000)
    public void checkErrorMails() throws URISyntaxException {
        List<MailTask> mailTaskList = mailTaskRepository.findByStatus(Defaults.MailStatus.ERROR);

        if (!mailTaskList.isEmpty()) {
            for (MailTask mailTask : mailTaskList) {
                Mail mail = mailResource.getMail(mailTask.getMailId()).getBody();
                if (mail != null) {
                    if (sendEmail(mail.getTo(), mail.getSubject(), mail.getContent(),
                        false, true)) {
                        mailTask.setStatus(Defaults.MailStatus.SENT);
                        mailTaskResource.updateMailTask(mailTask);
                    }
                } else {
                    if (log.isDebugEnabled()) {
                        log.warn("Mail with id = {} doesn't exist", mailTask.getMailId());
                    }
                }
            }
        }
    }

    @Scheduled(fixedRate = 60000)
    public void removeErrorMailTasks() {
        List<MailTask> mailTaskList = mailTaskRepository.findByStatus(Defaults.MailStatus.ERROR);
        Long removeErrorMailTaskAfterSeconds = applicationProperties.getRemoveErrorMailTaskAfterSeconds();

        if (log.isDebugEnabled()) {
            log.debug(mailTaskList.toString());
        }
        if (mailTaskList != null && !mailTaskList.isEmpty()) {
            for (MailTask mailTask : mailTaskList) {
                if (Instant.now().getEpochSecond() - mailTask.getCreatedDate().getEpochSecond() > removeErrorMailTaskAfterSeconds) {
                    mailTaskResource.deleteMailTask(mailTask.getId());
                }
                if (log.isDebugEnabled()) {
                    log.debug(mailTask.toString());
                }
            }
        }
    }


    public boolean sendEmail(String to, String subject, String content, boolean isMultipart, boolean isHtml) throws URISyntaxException {
        log.debug("Send email[multipart '{}' and html '{}'] to '{}' with subject '{}' and content={}",
            isMultipart, isHtml, to, subject, content);

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, isMultipart, StandardCharsets.UTF_8.name());
            message.setTo(to);
            message.setFrom(jHipsterProperties.getMail().getFrom());
            message.setSubject(subject);
            message.setText(content, isHtml);
            javaMailSender.send(mimeMessage);
            log.debug("Sent email to User '{}'", to);
        } catch (Exception e) {
            if (log.isDebugEnabled()) {
                log.warn("Email could not be sent to user '{}'", to, e);
            } else {
                log.warn("Email could not be sent to user '{}': {}", to, e.getMessage());
            }
            return false;
        }
        return true;
    }
}
