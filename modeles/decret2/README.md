Build the project:

```
mvn package
```

Generate stripes and export them to `colors.json`:

```
java -cp target/decret2-1.0-SNAPSHOT-jar-with-dependencies.jar xyz.faironnerieabc.cabanes2k17.decret2.GenerateStripes ../decret/decret1517.txt ../data/cabins.json colors.json
```

Print some stats:

```
java -cp target/decret2-1.0-SNAPSHOT-jar-with-dependencies.jar xyz.faironnerieabc.cabanes2k17.decret2.Stripes ../decret/decret1517.txt ../data/cabins.json
```

Generate chunks of text and export them to `chunks.json`

```
java -cp target/decret2-1.0-SNAPSHOT-jar-with-dependencies.jar xyz.faironnerieabc.cabanes2k17.decret2.Chunks ../decret/decret1517.txt ../data/chunks.json
```

For the moment the model integrates the following constraints:
 1. The eight stripes of each cabin are of eight different colors.
 2. Each of the six possible widths appears once or twice on each cabin. (That means there are four widths appearing once and two widths appearing twice).
 3. Two stripes on the same face (that is 0-1, 2-3, 4-5 and 6-7) are not allowed to have the same width.
 4. Two visible stripes next to each other (in the figure below A1-B0, B1-C0, A4-B5, B4-C5) are not allowed to have neither the same color nor the same width. (Note: the same applies to A0-A1 for example, but this is implied by constraints 1 and 3).

```
A group of cabins:
       5   4        5   4        5   4
     +---+---+    +---+---+    +---+---+
... 6|   A   |3  6|   B   |3  6|   C   |3 ...
    7|       |2  7|       |2  7|       |2
     +---+---+    +---+---+    +---+---+
       0   1        0   1        0   1
```
