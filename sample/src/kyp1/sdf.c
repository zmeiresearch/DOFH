/* This is sample file sdf.c from C module Kyp1 */

#include <stdio.h>

#include "kyp1_internal.h"
#include "kyp1.h"

int kyp1_sdf_module_func()
{
    printf("kyp1_sdf_module_func");
    return kyp1_asd_module_func()  - 1;
}

int kyp1_sdf_global_func(double d)
{
    int i = (int)(d/2);
    printf("kyp1_sdf_global_func: got %lf returning %d\n", d, i);
    return i;
}

