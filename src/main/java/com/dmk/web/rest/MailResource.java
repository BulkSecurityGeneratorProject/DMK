package com.dmk.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.dmk.domain.Defaults;
import com.dmk.domain.Mail;
import com.dmk.domain.MailTask;
import com.dmk.repository.MailRepository;
import com.dmk.web.rest.errors.BadRequestAlertException;
import com.dmk.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Mail.
 */
@RestController
@RequestMapping("/api")
public class MailResource {

    private final Logger log = LoggerFactory.getLogger(MailResource.class);

    private static final String ENTITY_NAME = "mail";

    private final MailRepository mailRepository;

    @Autowired
    private MailTaskResource mailTaskResource;

    public MailResource(MailRepository mailRepository) {
        this.mailRepository = mailRepository;
    }

    /**
     * POST  /mail : Create a new mail.
     *
     * @param mail the mail to create
     * @return the ResponseEntity with status 201 (Created) and with body the new mail, or with status 400 (Bad Request) if the mail has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/mail")
    @Timed
    public ResponseEntity<Mail> createMail(@RequestBody Mail mail) throws URISyntaxException {
        log.debug("REST request to save Mail : {}", mail);
        if (mail.getId() != null) {
            throw new BadRequestAlertException("A new mail cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Mail result = mailRepository.save(mail);
        ResponseEntity<Mail> responseEntity =  ResponseEntity.created(new URI("/api/mail/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);

        if (responseEntity.getStatusCode().is2xxSuccessful()) {
            MailTask mailTask = new MailTask();
            mailTask.setMailId(mail.getId());
            mailTask.setStatus(Defaults.MailStatus.READY_TO_SEND);

            mailTaskResource.createMailTask(mailTask);
        }
        return responseEntity;
    }

    /**
     * PUT  /mail : Updates an existing mail.
     *
     * @param mail the mail to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated mail,
     * or with status 400 (Bad Request) if the mail is not valid,
     * or with status 500 (Internal Server Error) if the mail couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/mail")
    @Timed
    public ResponseEntity<Mail> updateMail(@RequestBody Mail mail) throws URISyntaxException {
        log.debug("REST request to update Mail : {}", mail);
        if (mail.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Mail result = mailRepository.save(mail);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, mail.getId().toString()))
            .body(result);
    }

    /**
     * GET  /mail : get all the mail.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of mail in body
     */
    @GetMapping("/mail")
    @Timed
    public List<Mail> getAllMail() {
        log.debug("REST request to get all Mail");
        return mailRepository.findAll();
    }

    /**
     * GET  /mail/:id : get the "id" mail.
     *
     * @param id the id of the mail to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the mail, or with status 404 (Not Found)
     */
    @GetMapping("/mail/{id}")
    @Timed
    public ResponseEntity<Mail> getMail(@PathVariable Long id) {
        log.debug("REST request to get Mail : {}", id);
        Optional<Mail> mail = mailRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(mail);
    }

    /**
     * DELETE  /mail/:id : delete the "id" mail.
     *
     * @param id the id of the mail to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/mail/{id}")
    @Timed
    public ResponseEntity<Void> deleteMail(@PathVariable Long id) {
        log.debug("REST request to delete Mail : {}", id);

        mailRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
