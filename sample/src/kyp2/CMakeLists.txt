add_library (kyp2 kyp2.c) 

# Make sure the compiler can find include files for our library
# when other libraries or executables user it
target_include_directories (kyp2 PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
