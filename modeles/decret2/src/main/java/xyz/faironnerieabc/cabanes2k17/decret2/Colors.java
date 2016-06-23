package xyz.faironnerieabc.cabanes2k17.decret2;

import java.util.ArrayList;
import java.util.List;

public class Colors {
    private List<byte[]> all;
    private int count, count00, count01;

    public Colors() {
        all = new ArrayList<>();
        boolean[] used = new boolean[10];
        byte[] current = new byte[8];
        generateHelper(0, used, current);
        count = all.size();
        count00 = count01 = 0;
        for (byte[] colors : all) {
            if (colors[0] != 0) {
                if (colors[5] != 0) count00++;
                if (colors[5] != 1) count01++;
            }
        }
    }

    public int getCount(byte c0, byte c5) {
        if (c0 == -1 || c5 == -1) return count;
        if (c0 == c5) return count00;
        return count01;
    }

    public byte[] getColors(byte c0, byte c5, int i) {
        if (c0 == -1 || c5 == -1) return all.get(i);
        int j = 0;
        for (byte[] colors : all) {
            if (colors[0] != c0 && colors[5] != c5) {
                if (j == i) return colors;
                j++;
            }
        }
        return null;
    }

    private void generateHelper(int level, boolean[] used, byte[] current) {
        if (level == 8) {
            byte[] colors = new byte[8];
            for (byte f = 0; f < 8; f++) colors[f] = current[f];
            all.add(colors);
            return;
        }
        for (byte c = 0; c < 10; c++) {
            if (used[c]) continue;
            used[c] = true;
            current[level] = c;
            generateHelper(level + 1, used, current);
            used[c] = false;
        }
    }
}
