add_library (kyp3 kyp3.c) 

# Make sure the compiler can find include files for our library
# when other libraries or executables user it
target_include_directories (kyp3 PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

# depends on both kyp1 and kyp2
target_link_libraries(kyp3 kyp1 kyp2)
