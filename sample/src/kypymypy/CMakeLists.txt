add_executable( kypymypy kypymypy.c) 


# depends on both kyp1 and kyp3 and generate a cref
target_link_libraries(kypymypy kyp1 kyp3 -Wl,-M=kypymypy.map -Wl,--cref)
