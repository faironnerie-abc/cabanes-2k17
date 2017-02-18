package xyz.faironnerieabc.cabanes2k17.decret2;

import java.io.FileNotFoundException;
import java.io.PrintStream;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class Chunks {
    private String[] text;
    private int count[];

    public Chunks(String textFile, int groups[]) throws FileNotFoundException {
        text = Util.split(Util.readText(textFile), groups);
        this.count = groups;
    }

    public JSONObject toJSON() {
        JSONArray a = new JSONArray();
        for (int i = 0; i < text.length; i++) {
            JSONObject o = new JSONObject();
            o.put("text", text[i]);
            o.put("count", count[i]);
            a.add(o);
        }
        JSONObject o = new JSONObject();
        o.put("chunks", a);
        return o;
    }

    public static void main(String[] args) throws FileNotFoundException {
        Chunks chunks = new Chunks(args[0], Groups.GROUPS);
        PrintStream ps = new PrintStream(args[1]);
        ps.println(chunks.toJSON().toJSONString());
        ps.close();
    }
}
