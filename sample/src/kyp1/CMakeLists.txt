add_library (kyp1 asd.c sdf.c) 

# Make sure the compiler can find include files for our library
# when other libraries or executables user it
target_include_directories (kyp1 PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
