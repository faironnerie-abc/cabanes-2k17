package xyz.faironnerieabc.cabanes2k17.decret2;

import java.util.ArrayList;
import java.util.List;

public class Widths {
    private List<byte[]> all;
    private int count, count00, count01;

    public Widths() {
        all = new ArrayList<>();
        byte[] counts = new byte[6];
        byte[] current = new byte[8];
        generateHelper(0, counts, current);
        count = all.size();
        count00 = count01 = 0;
        for (byte[] widths : all) {
            if (widths[0] != 0) {
                if (widths[5] != 0) count00++;
                if (widths[5] != 1) count01++;
            }
        }
    }

    public int getCount(byte w0, byte w5) {
        if (w0 == -1 || w5 == -1) return count;
        if (w0 == w5) return count00;
        return count01;
    }

    public byte[] getWidths(byte w0, byte w5, int i) {
        if (w0 == -1 || w5 == -1) return all.get(i);
        int j = 0;
        for (byte[] widths : all) {
            if (widths[0] != w0 && widths[5] != w5) {
                if (j == i) return widths;
                j++;
            }
        }
        return null;
    }

    private void generateHelper(int level, byte[] counts, byte[] current) {
        if (level == 8) {
            if (check(counts)) {
                byte[] widths = new byte[8];
                for (byte f = 0; f < 8; f++) widths[f] = current[f];
                all.add(widths);
            }
            return;
        }
        for (byte w = 0; w < 6; w++) {
            if (counts[w] == 2 || (level % 2 == 1 && current[level - 1] == w))
                continue;
            counts[w]++;
            current[level] = w;
            generateHelper(level + 1, counts, current);
            counts[w]--;
        }
    }

    private static boolean check(byte[] counts) {
        for (int w = 0; w < 6; w++) {
            if (counts[w] != 1 && counts[w] != 2) return false;
        }
        return true;
    }
}
