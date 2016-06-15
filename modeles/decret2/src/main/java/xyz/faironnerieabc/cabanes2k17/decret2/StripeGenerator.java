package xyz.faironnerieabc.cabanes2k17.decret2;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;

public class StripeGenerator implements Iterator<int[]> {
    private static BigInteger[] SMALL_BIGS = new BigInteger[11];
    static {
        for (int i = 0; i <= 10; i++)
            SMALL_BIGS[i] = BigInteger.valueOf(i);
    }

    BigInteger seed;
    List<Integer> colors;
    List<Integer> widths;

    public StripeGenerator(BigInteger seed) {
        this.seed = seed;
        colors = new ArrayList<>();
        widths = new ArrayList<>();
    }

    public boolean hasNext() {
        return seed.bitCount() >= 42;
        // return true;
    }

    public int[] next() {
        if (!hasNext()) throw new NoSuchElementException("out of bits!");

        colors.clear();
        for (int c = 0; c < 10; c++) colors.add(c);
        widths.clear();
        for (int w = 0; w < 6; w++) widths.add(w);
        int w1 = nextSmall(6);
        widths.add(w1);
        int w2 = nextSmall(5);
        if (w2 >= w1) w2++;
        widths.add(w2);

        int[] stripes = new int[8];
        for (int i = 0; i < 8; i++) {
            stripes[i] = colors.remove(nextSmall(colors.size())) +
                10 * widths.remove(nextSmall(widths.size()));
        }
        return stripes;
    }

    public void remove() {
        throw new UnsupportedOperationException("remove not supported");
    }

    private int nextSmall(int small) {
        BigInteger[] dr = seed.divideAndRemainder(SMALL_BIGS[small]);
        seed = dr[0];
        return dr[1].intValue();
    }
}
