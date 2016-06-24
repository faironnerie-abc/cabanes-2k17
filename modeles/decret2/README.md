Build the project:

```
mvn package
```

Generate stripes and export them to `colors.json`:

```
java -cp target/decret2-1.0-SNAPSHOT-jar-with-dependencies.jar xyz.faironnerieabc.cabanes2k17.decret2.GenerateStripes ../decret/decret1517.txt colors.json
```

Print some stats:

```
java -cp target/decret2-1.0-SNAPSHOT-jar-with-dependencies.jar xyz.faironnerieabc.cabanes2k17.decret2.Stripes ../decret/decret1517.txt
```
