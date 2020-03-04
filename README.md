# DOFH
Dependency Overload From Hell - a C/C++ dependency visualizer

*DOFH* is a simple tool that parses the Cross-reference output produced by linking
an object file and visualizes it in an interactive fashion. It is based on cytoscape.js
and can be used to analyze product architecture and identify areas for improvement.

* To generate a the Cross-reference file (cref for short), pass in the "--cref" option
  to the linker (tested using GNU LD and LLVM LLD), like so 
```bash
ld --cref -o test test.o 
# or if using gcc/clang directly
gcc -Wl,--cref -o test test.c
```

