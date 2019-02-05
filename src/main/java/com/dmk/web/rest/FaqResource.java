package com.dmk.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.dmk.domain.Faq;
import com.dmk.service.FaqService;
import com.dmk.web.rest.errors.BadRequestAlertException;
import com.dmk.web.rest.util.HeaderUtil;
import io.github.jhipster.config.JHipsterProperties;
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
 * REST controller for managing Faq.
 */
@RestController
@RequestMapping("/api")
public class FaqResource {

    private final Logger log = LoggerFactory.getLogger(FaqResource.class);

    private static final String ENTITY_NAME = "faq";

    private final FaqService faqService;


    public FaqResource(FaqService faqService) {
        this.faqService = faqService;
    }

    /**
     * POST  /faqs : Create a new faq.
     *
     * @param faq the faq to create
     * @return the ResponseEntity with status 201 (Created) and with body the new faq, or with status 400 (Bad Request) if the faq has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/faqs")
    @Timed
    public ResponseEntity<Faq> createFaq(@RequestBody Faq faq) throws URISyntaxException {
        log.debug("REST request to save Faq : {}", faq);
        if (faq.getId() != null) {
            throw new BadRequestAlertException("A new faq cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Faq result = faqService.save(faq);
        return ResponseEntity.created(new URI("/api/faqs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /faqs : Updates an existing faq.
     *
     * @param faq the faq to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated faq,
     * or with status 400 (Bad Request) if the faq is not valid,
     * or with status 500 (Internal Server Error) if the faq couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/faqs")
    @Timed
    public ResponseEntity<Faq> updateFaq(@RequestBody Faq faq) throws URISyntaxException {
        log.debug("REST request to update Faq : {}", faq);
        if (faq.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Faq result = faqService.save(faq);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, faq.getId().toString()))
            .body(result);
    }

    /**
     * GET  /faqs : get all the faqs.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of faqs in body
     */
    @GetMapping("/faqs")
    @Timed
    public List<Faq> getAllFaqs() {
        log.debug("REST request to get all Faqs");
        return faqService.findAll();
    }

    /**
     * GET  /faqs/:id : get the "id" faq.
     *
     * @param id the id of the faq to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the faq, or with status 404 (Not Found)
     */
    @GetMapping("/faqs/{id}")
    @Timed
    public ResponseEntity<Faq> getFaq(@PathVariable Long id) {
        log.debug("REST request to get Faq : {}", id);
        Optional<Faq> faq = faqService.findOne(id);
        return ResponseUtil.wrapOrNotFound(faq);
    }

    /**
     * DELETE  /faqs/:id : delete the "id" faq.
     *
     * @param id the id of the faq to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/faqs/{id}")
    @Timed
    public ResponseEntity<Void> deleteFaq(@PathVariable Long id) {
        log.debug("REST request to delete Faq : {}", id);
        faqService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
