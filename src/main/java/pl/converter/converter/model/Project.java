package pl.converter.converter.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.sql.Blob;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
public class Project implements Serializable {

    @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    @Column(nullable = false, unique = true)
    private long id;

    @NotNull
    @Column(nullable = false)
    private Blob project;

    @NotNull
    @Column(nullable = false)
    private Timestamp lastLogin;

    @NotNull
    @Column(nullable = false)
    @Size(max=45)
    private String name;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Blob getProject() {
        return project;
    }

    public void setProject(Blob project) {
        this.project = project;
    }

    public Timestamp getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Timestamp lastLogin) {
        this.lastLogin = lastLogin;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Project)) return false;
        Project project1 = (Project) o;
        return id == project1.id &&
                Objects.equals(project, project1.project) &&
                Objects.equals(lastLogin, project1.lastLogin) &&
                Objects.equals(name, project1.name) &&
                Objects.equals(user, project1.user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, project, lastLogin, name, user);
    }
}
