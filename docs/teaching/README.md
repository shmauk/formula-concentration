# Teaching sheets

Printable A4 sheets for dietetics students, covering reading labels and building a recipe (not the Fewer-scoops suggestion).

- `cheat-sheet.pdf`: the method on the front, a worked NAN OPTIPRO 1 example on the back.
- `worksheet.pdf`: eight exercises using made-up Formulas A–F.
- `answer-key.pdf`: full working for every exercise.

To change an exercise, edit `exercises.ts`, then rebuild:

```sh
pnpm teaching:pdf
```

`build.ts` works out every answer with the site's recipe maths and prints the HTML to PDF with headless Chrome. Set `CHROME_PATH` if Chrome isn't in the default macOS location. The build fails if an exercise stops behaving as intended: if the warning trips (or doesn't) when it shouldn't, or if rounding the working differently would change the recipe.
