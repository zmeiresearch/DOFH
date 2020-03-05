/* This is sample file asd.c from C module Kyp1 */

#include <stdio.h>

#include "kyp1_internal.h"
#include "kyp1.h"

int kyp1_global_var = 0;

static int kyp1_asd_local_func(int k)
{
    printf("kyp1_asd_local_func: Got: %d\n", k);
    kyp1_global_var++;
    return k++;
}

int kyp1_asd_module_func()
{
    int i;
    scanf("kyp1_asd_module_func: Enter number: %d", &i);
    return kyp1_asd_local_func(i);
}

double kyp1_asd_global_func(double m)
{
    printf("kyp1_asd_global_exported_func: Got: %lf\n", m);
    kyp1_global_var--;
    return m++;
}

