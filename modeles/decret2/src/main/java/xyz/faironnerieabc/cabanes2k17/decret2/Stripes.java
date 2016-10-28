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
import org.json.simple.JSONValue;

public class Stripes {
    private List<byte[]> all;
    private JSONArray cabins;

    public Stripes(String textFile, String cabinFile, int groups[]) throws FileNotFoundException, NoSuchAlgorithmException {
        String chunks[] = Util.split(Util.readText(textFile), groups);
        JSONObject o = (JSONObject)(JSONValue.parse(Util.readText(cabinFile)));
        cabins = (JSONArray)(o.get("cabins"));

        // sanity check
        int s = 0;
        for (int c : groups) s += c;
        if (s != cabins.size())
            throw new IllegalArgumentException(String.format("%d cabins read from %s but %d cabins in groups", cabins.size(), cabinFile, s));

        all = new ArrayList<>();
        MessageDigest md = MessageDigest.getInstance("SHA-512");
        for (int g = 0; g < groups.length; g++) {
            byte[] digest = md.digest(chunks[g].getBytes());
            BigInteger bi = new BigInteger(1, digest);
            Iterator<byte[]> gen;
            if (g == 0)
                gen = new StripeGenerator(bi);
            else {
                byte[] last = all.get(all.size() - 1);
                gen = new StripeGenerator(bi, last[1], last[4]);
            }
            for (int c = 0; c < groups[g]; c++) all.add(gen.next());
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
        for (int i = 0; i < size(); i++) {
            JSONArray a = new JSONArray();
            for (int s : get(i)) a.add(s);
            JSONObject stripes = new JSONObject();
            stripes.put("stripes", a);
            JSONObject o = (JSONObject)(cabins.get(i));
            String id = (String)(o.get("id"));
            colors.put(id, stripes);
        }
        JSONObject result = new JSONObject();
        result.put("colors", colors);
        return result;
    }

    private static final double[] WIDTHS = {
        0.09, 0.27, 0.45, 0.63, 0.81, 0.99
    };

    private static void addStripe(byte s, double[] total) {
        total[s % 10] += WIDTHS[s / 10];
    }

    public double[] totalWidthsPerColor() {
        double[] total = new double[10];
        for (int i = 0; i < size(); i++) {
            JSONObject cab = (JSONObject)(cabins.get(i));
            if (cab.get("paint") == null) continue;
            byte[] s = get(i);
            addStripe(s[0], total);
            addStripe(s[1], total);
            if (cab.get("gapRight") != null) {
                addStripe(s[2], total);
                addStripe(s[3], total);
            }
            addStripe(s[4], total);
            addStripe(s[5], total);
            if (cab.get("gapLeft") != null) {
                addStripe(s[6], total);
                addStripe(s[7], total);
            }
        }
        return total;
    }

    public byte[] get(int i) {
        return all.get(i);
    }

    public int size() {
        return all.size();
    }


    public static void main(String[] args) throws FileNotFoundException, NoSuchAlgorithmException {
        Stripes stripes = new Stripes(args[0], args[1], Groups.GROUPS);
        System.out.println(stripes.all.size() + " cabins generated");
        for (int i = 0; i < 6; i++)
            System.out.println(Arrays.toString(stripes.all.get(i)));
        System.out.println("... etc\n\nDistribution of common stripes");
        stripes.commonDistribution();
        System.out.println("\nSurfaces by color");
        String sep = "+-------+-------------+------------+";
        System.out.println(sep);
        System.out.printf("|%7s|%13s|%12s|%n", "couleur", "surface (m^2)", "peinture (l)");
        System.out.println(sep);
        double[] total = stripes.totalWidthsPerColor();
        for (int color = 0; color < 10; color++) {
            // la hauteur d'une cabane est 2 m
            double surface = total[color] * 2;
            // le rendement de la peinture est 12 m^2 / l et il faut 2 couches
            double litres = surface / 12 * 2;
            System.out.printf("|%7d|%13.0f|%12.0f|%n", color + 1, surface, litres);
        }
        System.out.println(sep);
    }
}
