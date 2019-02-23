package pl.converter.converter.model;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@NamedNativeQuery(name = "Role.addUserToRole", query = "INSERT user_role VALUES (COALESCE(:role,'user'), :username)")
public class Role implements Serializable {

	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(nullable = false, unique = true)
	private long id;

	@Column(nullable = false, unique = true, name = "roleName")
	private String role;
	@Column(length=250)
	private String description;
	@ManyToMany(cascade = CascadeType.ALL,fetch= FetchType.EAGER)
	@JoinTable(name = "userRole",
	   joinColumns = {@JoinColumn(name="role", referencedColumnName="roleName")},
	   inverseJoinColumns = {@JoinColumn(name="username", referencedColumnName="username")})
	private Set<User> users;

	public Role(){
		this.users=new HashSet<>();
	}

	public Role(String role, String description){
		this.role=role;
		this.description=description;
	}
	@Override
	public String toString() {
		return "Role [role=" + role + ", description=" + description + ", users=" + users + "]";
	}

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Role)) return false;
        Role role1 = (Role) o;
        return id == role1.id &&
                Objects.equals(role, role1.role) &&
                Objects.equals(description, role1.description) &&
                Objects.equals(users, role1.users);
    }

    @Override
	public int hashCode() {
		return Objects.hash(role, description, users);
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getrole() {
		return role;
	}
	public void setrole(String role) {
		this.role = role;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}

	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}


}

