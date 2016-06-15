package xyz.faironnerieabc.cabanes2k17.decret2;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import static xyz.faironnerieabc.cabanes2k17.decret2.Constants.*;

public class Stripes {
    private List<int[]> allStripes;

    public Stripes(String fileName) throws FileNotFoundException, NoSuchAlgorithmException {
        Scanner sc = new Scanner(new File(fileName));
        allStripes = new ArrayList<int[]>();
        MessageDigest md = MessageDigest.getInstance("SHA-384");
        for (int g = 0; g < GROUP_COUNT; g++) {
            byte[] digest = md.digest(sc.nextLine().getBytes());
            StripeGenerator gen = new StripeGenerator(new BigInteger(1, digest));
            System.out.printf("%5d%5d%n", g, GROUPS[g]);
            for (int c = 0; c < GROUPS[g]; c++) {
                allStripes.add(gen.next());
            }
        }
        System.out.println(allStripes.size() + " cabins generated");
    }

    public int commonStripes(int i, int j) {
        int[] s = allStripes.get(i);
        int[] t = allStripes.get(j);
        int common = 0;
        for (int k = 0; k < 8; k++)
            for (int l = 0; l < 8; l++)
                if (s[k] == t[l]) common++;
        return common;
    }

    public void commonDistribution() {
        int[] distrib = new int[9];
        int n = allStripes.size();
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                distrib[commonStripes(i, j)]++;
        for (int k = 0; k <= 8; k++)
            System.out.printf("%2d%10d%n", k, distrib[k]);
    }

    public JSONObject toJSON() {
        JSONObject colors = new JSONObject();
        for (int i = 0; i < allStripes.size(); i++) {
            int[] s = allStripes.get(i);
            JSONArray a = new JSONArray();
            for (int j = 0; j < 8; j++) a.add(s[j]);
            JSONObject stripes = new JSONObject();
            stripes.put("stripes", a);
            colors.put(i + "", stripes);
        }
        JSONObject result = new JSONObject();
        result.put("colors", colors);
        return result;
    }

    public static void main(String[] args) throws FileNotFoundException, NoSuchAlgorithmException {
        Stripes stripes = new Stripes(args[0]);
        stripes.commonDistribution();
        // for (int[] s : stripes.allStripes) {
        //     System.out.println(Arrays.toString(s));
        // }
        PrintStream ps = new PrintStream(args[1]);
        ps.println(stripes.toJSON().toJSONString());
        ps.close();
    }
}
