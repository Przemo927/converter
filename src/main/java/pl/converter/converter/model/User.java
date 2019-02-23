package pl.converter.converter.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
public class User implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	@Column(nullable = false, unique = true)
    private long id;
	@Size(max=45)
    @NotNull
    @Pattern(regexp = "[A-Z]{1}[a-z0-9]+",message = "First letter of username should be uppercase.")
	@Column(nullable = false, unique = true, length=45)
    private String username;
	@Size(max=60)
    @NotNull
    @Email
	@Column(nullable = false, unique = true, length=60)
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Size(max=255)
    @NotNull
	@Column(nullable = false, length=255)
    private String password;
    @NotNull
	@Column(nullable = false)
    private boolean active;

    private Timestamp lastLogin;

     
    public User() { }
     
    public User(User user) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.active=user.isActive();
        this.lastLogin=user.lastLogin;
    }
     
    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    @JsonIgnore
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public boolean isActive() {
        return active;
    }
    public void setActive(boolean active) {
        this.active = active;
    }
    public Timestamp getLastLogin() {
        return lastLogin;
    }
    public void setLastLogin(Timestamp lastLogin) {
        this.lastLogin = lastLogin;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return id == user.id &&
                active == user.active &&
                Objects.equals(username, user.username) &&
                Objects.equals(email, user.email) &&
                Objects.equals(password, user.password) &&
                Objects.equals(lastLogin, user.lastLogin);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, email, password, active, lastLogin);
    }
}