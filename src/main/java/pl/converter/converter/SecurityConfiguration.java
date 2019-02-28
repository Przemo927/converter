package pl.converter.converter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.expression.SecurityExpressionOperations;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.expression.DefaultWebSecurityExpressionHandler;
import org.springframework.security.web.access.expression.WebSecurityExpressionRoot;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import pl.converter.converter.security.PBKDF2Encoder;

import javax.sql.DataSource;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final DataSource dataSource;

    @Value("${spring.queries.users-query}")
    private String usersQuery;

    @Value("${spring.queries.roles-query}")
    private String rolesQuery;

    @Autowired
    public SecurityConfiguration(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.jdbcAuthentication()
                .passwordEncoder(new PBKDF2Encoder())
                .usersByUsernameQuery(usersQuery)
                .authoritiesByUsernameQuery(rolesQuery).rolePrefix("")
                .dataSource(dataSource);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/register","/registerUser").permitAll()
                .antMatchers("/").hasAnyAuthority("user","admin")
                .anyRequest().authenticated();
        http
                .formLogin()
                .loginPage("/login")
                .defaultSuccessUrl("/home",true)
                .permitAll()
                .usernameParameter("username")
                .passwordParameter("password")
                .and()
                .logout()
                .permitAll().and().exceptionHandling().authenticationEntryPoint(new LoginUrlAuthenticationEntryPoint("/login"));
    }

    @Override
    public void configure(WebSecurity web) {
        web.expressionHandler(new DefaultWebSecurityExpressionHandler() {
            @Override
            protected SecurityExpressionOperations createSecurityExpressionRoot(Authentication authentication, FilterInvocation fi) {
                WebSecurityExpressionRoot root = (WebSecurityExpressionRoot) super.createSecurityExpressionRoot(authentication, fi);
                root.setDefaultRolePrefix(""); //remove the prefix ROLE_
                return root;
            }
        });
        web
                .ignoring()
                .antMatchers("/resources/**", "/static/**", "/css/**", "/js/**", "/images/**","/favicon.ico");
    }
}
