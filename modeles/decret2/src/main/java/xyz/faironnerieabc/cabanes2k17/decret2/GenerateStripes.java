package xyz.faironnerieabc.cabanes2k17.decret2;

import java.io.FileNotFoundException;
import java.io.PrintStream;
import java.security.NoSuchAlgorithmException;

public class GenerateStripes {
    public static void main(String[] args) throws FileNotFoundException, NoSuchAlgorithmException {
        Stripes stripes = new Stripes(args[0], args[1], Groups.GROUPS);
        PrintStream ps = new PrintStream(args[2]);
        ps.println(stripes.toJSON().toJSONString());
        ps.close();
    }
}
