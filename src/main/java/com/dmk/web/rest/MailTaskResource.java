package com.dmk.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.dmk.domain.Defaults;
import com.dmk.domain.MailTask;
import com.dmk.service.MailTaskService;
import com.dmk.web.rest.errors.BadRequestAlertException;
import com.dmk.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing MailTask.
 */
@RestController
@RequestMapping("/api")
public class MailTaskResource {

    private final Logger log = LoggerFactory.getLogger(MailTaskResource.class);

    private static final String ENTITY_NAME = "mailTask";

    private final MailTaskService mailTaskService;

    public MailTaskResource(MailTaskService mailTaskService) {
        this.mailTaskService = mailTaskService;
    }

    /**
     * POST  /mail-tasks : Create a new mailTask.
     *
     * @param mailTask the mailTask to create
     * @return the ResponseEntity with status 201 (Created) and with body the new mailTask, or with status 400 (Bad Request) if the mailTask has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/mail-tasks")
    @Timed
    public ResponseEntity<MailTask> createMailTask(@RequestBody MailTask mailTask) throws URISyntaxException {
        log.debug("REST request to save MailTask : {}", mailTask);
        if (mailTask.getId() != null) {
            throw new BadRequestAlertException("A new mailTask cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MailTask result = mailTaskService.save(mailTask);
        return ResponseEntity.created(new URI("/api/mail-tasks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /mail-tasks : Updates an existing mailTask.
     *
     * @param mailTask the mailTask to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated mailTask,
     * or with status 400 (Bad Request) if the mailTask is not valid,
     * or with status 500 (Internal Server Error) if the mailTask couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/mail-tasks")
    @Timed
    public ResponseEntity<MailTask> updateMailTask(@RequestBody MailTask mailTask) throws URISyntaxException {
        log.debug("REST request to update MailTask : {}", mailTask);
        if (mailTask.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        MailTask result = mailTaskService.save(mailTask);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, mailTask.getId().toString()))
            .body(result);
    }

    /**
     * GET  /mail-tasks : get all the mailTasks.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of mailTasks in body
     */
    @GetMapping("/mail-tasks")
    @Timed
    public List<MailTask> getAllMailTasks() {
        log.debug("REST request to get all MailTasks");
        return mailTaskService.findAll();
    }

    /**
     * GET  /mail-tasks/:id : get the "id" mailTask.
     *
     * @param id the id of the mailTask to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the mailTask, or with status 404 (Not Found)
     */
    @GetMapping("/mail-tasks/{id}")
    @Timed
    public ResponseEntity<MailTask> getMailTask(@PathVariable Long id) {
        log.debug("REST request to get MailTask : {}", id);
        Optional<MailTask> mailTask = mailTaskService.findOne(id);
        return ResponseUtil.wrapOrNotFound(mailTask);
    }

    /**
     * DELETE  /mail-tasks/:id : delete the "id" mailTask.
     *
     * @param id the id of the mailTask to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/mail-tasks/{id}")
    @Timed
    public ResponseEntity<Void> deleteMailTask(@PathVariable Long id) {
        log.debug("REST request to delete MailTask : {}", id);
        mailTaskService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
