package xyz.faironnerieabc.cabanes2k17.decret2;

import java.util.Arrays;

public class Groups {
    public static final int[] GROUPS = {
        // Ste Adresse
        6, 14, 12, 14, 18, 9,
        // LH first rows
        23, 27,
        // LH blocks
        11, 11, 11, 11, 11, 11,
        16, 16, 16, 16, 16, 16,
        18, 18, 18, 18, 18, 18,
        24, 24, 24, 24, 24, 24,
        26, 27, 27, 27, 27, 27
    };
    // fake ids for each group
    public static final String[] GROUP_IDS = {
        // Ste Adresse
        "S1", "S2", "S3", "S4", "S5", "S6",
        // LH first rows
        "L1", "L2",
        // LH blocks
        "R1", "R2", "R3", "R4", "R5", "R6",
        "R7", "R8", "R9", "R10", "R11", "R12",
        "R13", "R14", "R15", "R16", "R17", "R18",
        "R19", "R20", "R21", "R22", "R23", "R24",
        "R25", "R26", "R27", "R28", "R29", "R30"
    };

    public static final int SUBGROUP_BASE = 7;
    public static final int[][] SUBGROUPS = new int[GROUPS.length][];
    private static int cabCount = 0;
    static {
        for (int g = 0; g < GROUPS.length; g++) {
            SUBGROUPS[g] = computeSubgroups(GROUPS[g]);
            cabCount += GROUPS[g];
        }
    };
    public static final int CAB_COUNT = cabCount;

    private static int[] computeSubgroups(int n) {
        int cabsPerSubgroup = SUBGROUP_BASE;
        int subgroupCount = n / cabsPerSubgroup;
        int r = n % cabsPerSubgroup;
        while (r > subgroupCount) {
            subgroupCount++;
            cabsPerSubgroup = n / subgroupCount;
            r = n % subgroupCount;
        }
        int[] s = new int[subgroupCount];
        for (int i = 0; i < s.length; i++) {
            s[i] = cabsPerSubgroup + (i < r ? 1 : 0);
        }
        return s;
    }

    public static void main(String[] args) {
        for (int g  = 0; g < GROUPS.length; g++)
            System.out.println(GROUPS[g] + " : " + Arrays.toString(SUBGROUPS[g]));
        int sum = 0;
        for (int[] s : SUBGROUPS)
                sum += s.length;
        System.out.println(sum);
    }
}
