package xyz.faironnerieabc.cabanes2k17.decret2;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import static xyz.faironnerieabc.cabanes2k17.decret2.Constants.*;

public class SplitText {
    String[] chunks;

    public SplitText(String fileName) throws FileNotFoundException {
        Scanner sc = new Scanner(new File(fileName));
        List<String> words = new ArrayList<>();
        while (sc.hasNext()) words.add(sc.next());
        sc.close();

        int charsLeft = 0;
        for (String w : words) charsLeft += w.length();
        charsLeft += (words.size() - 1) - (GROUP_COUNT - 1);
        int cabinsLeft = CABIN_COUNT;

        chunks = new String[GROUP_COUNT];
        int i = 0;
        for (int g = 0; g < GROUP_COUNT; g++) {
            int charsToUse = charsLeft * GROUPS[g] / cabinsLeft;
            chunks[g] = words.get(i++);
            while (chunks[g].length() < charsToUse) {
                chunks[g] += " " + words.get(i++);
            }
            int l = chunks[g].length();
            int l1 = l - words.get(i - 1).length() - 1;
            if (charsToUse - l1 < l - charsToUse) {
                chunks[g] = chunks[g].substring(0, l1);
                i--;
            }
            System.out.printf("%5d%5d%5d%5d %s%n", g, GROUPS[g], charsToUse, chunks[g].length(), chunks[g]);
            charsLeft -= chunks[g].length();
            cabinsLeft -= GROUPS[g];
        }
    }

    public String getChunk(int i) {
        return chunks[i];
    }

    public void writeChunks(String fileName) throws FileNotFoundException {
        PrintStream ps = new PrintStream(fileName);
        for (String c : chunks) ps.println(c);
        ps.close();
    }

    public static void main(String[] args) {
        System.out.printf("Splitting text for %d cabins in %d groups...%n", CABIN_COUNT, GROUP_COUNT);
        SplitText st = null;
        try {
            st = new SplitText(args[0]);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return;
        }
        System.out.println("... done");
        try {
            st.writeChunks(args[1]);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return;
        }
    }
}
