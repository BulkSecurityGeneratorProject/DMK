package com.dmk.repository;

import com.dmk.domain.MailTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the MailTask entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MailTaskRepository extends JpaRepository<MailTask, Long> {

    List<MailTask> findByStatus(String status);
}
