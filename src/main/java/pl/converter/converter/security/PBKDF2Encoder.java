package pl.converter.converter.security;

import de.rtner.security.auth.spi.PBKDF2Parameters;
import de.rtner.security.auth.spi.SimplePBKDF2;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.logging.Level;
import java.util.logging.Logger;

public class PBKDF2Encoder implements PasswordEncoder {

    private static Logger logger=Logger.getLogger(PBKDF2Encoder.class.getName());

    public static void main(String[] args){
        PBKDF2Encoder encoder=new PBKDF2Encoder();
        System.out.println(encoder.matches("przemek","BC486D31CB5C78305FCED24A608C6234:1000:55B498B5C39B0CCFCF42A58B0A3B23A79DB1275045FA006F62CD913E981B58352FE50C3FA128F3A036F0B36C5BEB12E81EB4BC363DBCEBFEEBE5807C3DCF3BD8"));
    }
    @Override
    public String encode(CharSequence charSequence) {
        return hashPassword(charSequence.toString());
    }

    public static String hashPassword(String password) {
        if (password == null) return null;
        SimplePBKDF2 crypto = new SimplePBKDF2();
        fillParameters(crypto,password);
        return crypto.getFormatter().toString(crypto.getParameters());
    }
    protected static void fillParameters(SimplePBKDF2 crypto,String password) {
        PBKDF2Parameters params=crypto.getParameters();
        params.setHashCharset("UTF-8");
        params.setHashAlgorithm("HmacSHA1");
        params.setIterationCount(1000);
        params.setSalt(generateSalt(16));
        params.setDerivedKey(crypto.deriveKey(password,64));

    }
    protected static byte[] generateSalt(int saltSize) {
        byte[] salt = new byte[saltSize];
        try {
            SecureRandom secureRandom = SecureRandom.getInstance("SHA1PRNG");
            secureRandom.nextBytes(salt);
        } catch (NoSuchAlgorithmException e) {
            logger.log(Level.SEVERE,"generateSalt() salt size= "+saltSize,e);
        }
        return salt;
    }

    @Override
    public boolean matches(CharSequence charSequence, String hashedPassword) {
        return new SimplePBKDF2(16,1000).verifyKeyFormatted(hashedPassword,charSequence.toString());
    }
}
