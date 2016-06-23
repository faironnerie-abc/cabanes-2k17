package xyz.faironnerieabc.cabanes2k17.decret2;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

import static xyz.faironnerieabc.cabanes2k17.decret2.Groups.*;

public class SplitText {
    private String[][] chunks;

    public static String[] split(String text, int[] groups) {
        String[] words = text.split(" ");
        int charsLeft = 0;
        for (String w : words) charsLeft += w.length();
        charsLeft += (words.length - 1) - (groups.length - 1);
        int cabinsLeft = 0;
        for (int c : groups) cabinsLeft += c;

        String[] chunks = new String[groups.length];
        int i = 0;
        for (int g = 0; g < groups.length; g++) {
            int charsToUse = charsLeft * groups[g] / cabinsLeft;
            chunks[g] = words[i++];
            while (chunks[g].length() < charsToUse)
                chunks[g] += " " + words[i++];
            int l = chunks[g].length();
            int l1 = l - words[i - 1].length() - 1;
            if (charsToUse - l1 < l - charsToUse) {
                chunks[g] = chunks[g].substring(0, l1);
                i--;
            }
            charsLeft -= chunks[g].length();
            cabinsLeft -= groups[g];
        }
        return chunks;
    }

    public SplitText(String fileName) throws FileNotFoundException {
        Scanner sc = new Scanner(new File(fileName));
        String text = sc.next();
        while (sc.hasNext()) text += " " + sc.next();
        sc.close();
        String[] groupChunks = split(text, GROUPS);
        chunks = new String[GROUPS.length][];
        for (int g = 0; g < GROUPS.length; g++) {
            chunks[g] = split(groupChunks[g], SUBGROUPS[g]);
        }
    }

    public String getChunk(int g, int s) {
        return chunks[g][s];
    }

    public static void main(String[] args)  throws FileNotFoundException {
        SplitText split = new SplitText(args[0]);
        for (int g = 0; g < GROUPS.length; g++) {
            System.out.printf("%n*** Group %s (%d cabins) ***%n", GROUP_IDS[g], GROUPS[g]);
            for (int s = 0; s < SUBGROUPS[g].length; s++) {
                System.out.println(SUBGROUPS[g][s] + " : " + split.getChunk(g, s));
            }
        }
    }
}
