/* This is sample file kyp2.c from C module Kyp2 */

#include <stdio.h>

#include "kyp2.h"

int kyp2_global_var = 0;

static int kyp2_local_func(int k)
{
    printf("kyp2_local_func: Got: %d\n", k);
    kyp2_global_var++;
    return k--;
}

double kyp2_global_func(double m)
{
    printf("kyp2_global_func: Got: %lf\n", m);
    kyp2_global_var--;
    return m++;
}

