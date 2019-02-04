package com.dmk.service;

import com.dmk.domain.MailTask;
import com.dmk.repository.MailTaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing MailTask.
 */
@Service
@Transactional
public class MailTaskService {

    private final Logger log = LoggerFactory.getLogger(MailTaskService.class);

    private final MailTaskRepository mailTaskRepository;

    public MailTaskService(MailTaskRepository mailTaskRepository) {
        this.mailTaskRepository = mailTaskRepository;
    }

    /**
     * Save a mailTask.
     *
     * @param mailTask the entity to save
     * @return the persisted entity
     */
    public MailTask save(MailTask mailTask) {
        log.debug("Request to save MailTask : {}", mailTask);
        return mailTaskRepository.save(mailTask);
    }

    /**
     * Get all the mailTasks.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<MailTask> findAll() {
        log.debug("Request to get all MailTasks");
        return mailTaskRepository.findAll();
    }


    /**
     * Get mailTasks by status.
     *
     * @param status the status of entity
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<MailTask> findByStatus(String status) {
        log.debug("Request to get MailTasks by status");
        return mailTaskRepository.findByStatus(status);
    }


    /**
     * Get one mailTask by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<MailTask> findOne(Long id) {
        log.debug("Request to get MailTask : {}", id);
        return mailTaskRepository.findById(id);
    }

    /**
     * Delete the mailTask by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete MailTask : {}", id);
        mailTaskRepository.deleteById(id);
    }
}
