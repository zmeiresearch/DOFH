/* This is sample file kyp3.c from C module Kyp3 */

#include <stdio.h>

#include "kyp3.h"
#include "kyp1.h"
#include "kyp2.h"

double kyp3_global_func(double m)
{
    printf("kyp3_global_func: Got: %lf\n", m);
    return m++;
}

int kyp3_global_func_1()
{
	printf("kyp3_global_func_1");
	return (int)kyp2_global_func(kyp3_global_func(kyp1_asd_global_var));
}

