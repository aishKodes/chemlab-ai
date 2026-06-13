# Hydrocarbon Naming Quest QA Checklist

## Labels

1. C labels are visible in Learning View.
2. H labels are visible when labels and H atoms are enabled.
3. Formula uses proper subscripts, such as CH₄ and C₄H₁₀.
4. Locant badges appear near correct atoms during numbering.
5. Bond length labels appear only in Measurement View.
6. Angle labels appear only in Measurement View.
7. Labels do not cover the whole molecule.
8. Mobile label view remains readable, especially with Clean View.

## Molecule

9. Methane shows tetrahedral geometry.
10. Ethane shows correct H count.
11. Butane shows a four-carbon main chain.
12. 2-Methylpentane shows the methyl substituent in orange.
13. But-1-ene shows the double bond in pink/gold.

## Sound

14. Atom click sound works or procedural fallback works.
15. Wrong answer sound works.
16. Success sound works.
17. Mute button works.
18. No sound plays before user interaction.
19. Missing files do not crash the app.

## Gameplay

20. Butane can be completed.
21. 2-Methylpentane can be completed.
22. But-1-ene can be completed.
23. Text does not block the molecule.

## Dev Routes

24. `/dev/molecule-3d-debug` shows molecule labels, validation, and formula calculation.
25. `/dev/hydrocarbon-quest-audit` shows label status, sound status, missing sound files, and level warnings.
