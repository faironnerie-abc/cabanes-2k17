package xyz.faironnerieabc.cabanes2k17.decret2;

public class Constants {
    public static final int GROUP_COUNT = 115;
    public static final int[] GROUPS = new int[GROUP_COUNT];

    private static int cabinCount = 0;
    static {
        for (int i = 0; i < GROUP_COUNT; i++) GROUPS[i] = 6;
        // GROUPS[1] = GROUPS[2] = GROUPS[5] = GROUPS[6] = GROUPS[10] = 7;
        // GROUPS[11] = GROUPS[12] = 8;
        // GROUPS[7] = GROUPS[8] = GROUPS[9] = GROUPS[13] = GROUPS[14] = GROUPS[15] = 9;
        GROUPS[10] = 4;
        GROUPS[11] = 5;
        GROUPS[1] = GROUPS[2] = GROUPS[5] = GROUPS[6] = GROUPS[12] = GROUPS[16] = GROUPS[17] = GROUPS[18] = 7;
        GROUPS[13] = GROUPS[14] = 8;
        for (int c : GROUPS) cabinCount += c;
    }

    public static final int CABIN_COUNT = cabinCount;
}
