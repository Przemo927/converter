package pl.converter.converter.configuration;

import org.springframework.beans.factory.InjectionPoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

import javax.annotation.PreDestroy;
import java.io.File;
import java.io.IOException;
import java.util.logging.FileHandler;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

@Configuration
public class LoggerConfiguration {

    private static final String NAME_LOG_FILE="ProjectLog.log";
    private static FileHandler fh;
    private static Logger logger;
    private final static String LOG_PATH=System.getProperty("user.dir")+ File.separator+"log"+File.separator+NAME_LOG_FILE;

    @Bean
    @Scope("prototype")
    public Logger logger(InjectionPoint injectionPoint) {
        try {
            logger = Logger.getLogger(injectionPoint.getMember().getDeclaringClass().getName());
            File file = new File(LOG_PATH);
            file.getParentFile().mkdirs();
            fh = new FileHandler(LOG_PATH);
            fh.setLevel(Level.ALL);
            logger.addHandler(fh);
            SimpleFormatter formatter = new SimpleFormatter();
            fh.setFormatter(formatter);
        } catch (SecurityException | IOException e) {
            logger.log(Level.SEVERE,"Logger exception",e);
        }
        return logger;
    }

    @PreDestroy
    public void closeFileHandler(){
        fh.close();
    }
}
