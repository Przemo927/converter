package pl.converter.converter;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer  {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("login").setViewName("login");
        registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
        registry.addViewController("register").setViewName("register");
        registry.addViewController("/home").setViewName("angular/index");
        registry.addViewController("/#/").setViewName("angular/index");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry){
        registry.addResourceHandler("/**").addResourceLocations("classpath:/templates/angular/");
    }

}
