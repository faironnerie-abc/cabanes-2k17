package xyz.faironnerieabc.cabanes2k17.decret2;

import java.io.FileNotFoundException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import static xyz.faironnerieabc.cabanes2k17.decret2.Groups.*;

public class Stripes {
    private List<byte[]> all;

    public Stripes(String fileName) throws FileNotFoundException, NoSuchAlgorithmException {
        SplitText split = new SplitText(fileName);
        all = new ArrayList<>();
        MessageDigest md = MessageDigest.getInstance("SHA-384");
        for (int g = 0; g < GROUPS.length; g++) {
            for (int s = 0; s < SUBGROUPS[g].length; s++) {
                byte[] digest = md.digest(split.getChunk(g, s).getBytes());
                BigInteger bi = new BigInteger(1, digest);
                Iterator<byte[]> gen = null;
                if (s == 0) {
                    gen = new StripeGenerator(bi);
                } else {
                    byte[] last = all.get(all.size() - 1);
                    gen = new StripeGenerator(bi, last[1], last[4]);
                }
                for (int c = 0; c < SUBGROUPS[g][s]; c++) {
                    all.add(gen.next());
                }
            }
        }
    }

    public int commonStripes(int i, int j) {
        byte[] s = all.get(i);
        byte[] t = all.get(j);
        int common = 0;
        for (int k = 0; k < 8; k++)
            for (int l = 0; l < 8; l++)
                if (s[k] == t[l]) common++;
        return common;
    }

    public void commonDistribution() {
        int[] distrib = new int[9];
        int n = all.size();
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                distrib[commonStripes(i, j)]++;
        for (int k = 0; k <= 8; k++)
            System.out.printf("%2d%10d%n", k, distrib[k]);
    }

    public JSONObject toJSON() {
        JSONObject colors = new JSONObject();
        int i = 0;
        for (int g = 0; g < GROUPS.length; g++) {
            for (int c = 0; c < GROUPS[g]; c++) {
                byte[] s = all.get(i++);
                JSONArray a = new JSONArray();
                for (int j = 0; j < 8; j++) a.add(s[j]);
                JSONObject stripes = new JSONObject();
                stripes.put("stripes", a);
                String id = GROUP_IDS[g] + "-" + c;
                colors.put(id, stripes);
            }
        }
        JSONObject result = new JSONObject();
        result.put("colors", colors);
        return result;
    }

    public byte[] get(int i) {
        return all.get(i);
    }

    public int size() {
        return all.size();
    }

    public static void main(String[] args) throws FileNotFoundException, NoSuchAlgorithmException {
        Stripes stripes = new Stripes(args[0]);
        System.out.println(stripes.size() + " cabins generated");
        for (int i = 0; i < 6; i++)
            System.out.println(Arrays.toString(stripes.get(i)));
        System.out.println("... etc\n\nDistribution of common stripes");
        stripes.commonDistribution();
    }
}
