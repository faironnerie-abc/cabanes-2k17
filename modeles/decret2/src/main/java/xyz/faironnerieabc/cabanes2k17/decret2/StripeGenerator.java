package xyz.faironnerieabc.cabanes2k17.decret2;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Iterator;
import java.util.NoSuchElementException;

public class StripeGenerator implements Iterator<byte[]> {
    private static Widths widths = new Widths();
    private static Colors colors = new Colors();

    private BigInteger seed;
    private byte w0, w5, c0, c5;

    public StripeGenerator(BigInteger seed, byte s0, byte s5) {
        this.seed = seed;
        w0 = (byte)(s0 / 10);
        c0 = (byte)(s0 % 10);
        w5 = (byte)(s5 / 10);
        c5 = (byte)(s5 % 10);
    }

    public StripeGenerator(BigInteger seed) {
        this.seed = seed;
        w0 = w5 = c0 = c5 = -1;
    }

    public boolean hasNext() {
        long needed = (long)widths.getCount(w0, w5) * colors.getCount(c0, c5);
        return seed.compareTo(BigInteger.valueOf(needed)) > 0;
    }

    public byte[] next() {
        if (!hasNext()) throw new NoSuchElementException("out of bits!");
        byte[] w = widths.getWidths(w0, w5, nextInt(widths.getCount(w0, w5)));
        byte[] c = colors.getColors(c0, c5, nextInt(colors.getCount(c0, c5)));
        w0 = w[1]; w5 = w[4];
        c0 = c[1]; c5 = c[4];
        byte s[] = new byte[8];
        for (int f = 0; f < 8; f++) s[f] = (byte)(10 * w[f] + c[f]);
        return s;
    }

    public void remove() {
        throw new UnsupportedOperationException("remove not supported");
    }

    private int nextInt(int n) {
        BigInteger[] dr = seed.divideAndRemainder(BigInteger.valueOf(n));
        seed = dr[0];
        return dr[1].intValue();
    }

    public static void main(String[] args) {
        String s = "1234567890";
        String b = "";
        for (int i = 0; i < 10; i++) b += s;
        Iterator<byte[]> gen = new StripeGenerator(new BigInteger(b));
        while (gen.hasNext()) {
            byte[] stripes = gen.next();
            System.out.println(Arrays.toString(stripes));
        }
    }
}
