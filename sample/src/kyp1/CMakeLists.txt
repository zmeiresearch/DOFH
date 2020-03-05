add_library (kyp1 asd.c sdf.c) 

# Make sure the compiler can find include files for our Hello library
# when other libraries or executables link to Hello
target_include_directories (kyp1 PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
