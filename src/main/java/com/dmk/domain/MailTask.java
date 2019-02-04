package com.dmk.domain;


import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A MailTask.
 */
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "mail_task")
public class MailTask implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mail_id")
    private Long mailId;

    @Column(name = "status")
    private String status;

    @Column(name = "last_update")
    @LastModifiedDate
    private Instant lastUpdate;

    @Column(name = "created_date", updatable = false)
    @CreatedDate
    private Instant createdDate;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMailId() {
        return mailId;
    }

    public MailTask mailId(Long mailId) {
        this.mailId = mailId;
        return this;
    }

    public void setMailId(Long mailId) {
        this.mailId = mailId;
    }

    public String getStatus() {
        return status;
    }

    public MailTask status(String status) {
        this.status = status;
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getLastUpdate() {
        return lastUpdate;
    }

    public MailTask lastUpdate(Instant lastUpdate) {
        this.lastUpdate = lastUpdate;
        return this;
    }

    public void setLastUpdate(Instant lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public MailTask createdDate(Instant createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        MailTask mailTask = (MailTask) o;
        if (mailTask.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), mailTask.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "MailTask{" +
            "id=" + getId() +
            ", mailId=" + getMailId() +
            ", status='" + getStatus() + "'" +
            ", lastUpdate='" + getLastUpdate() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
